// Default primes for prototype testing (These must be BigInts for Wasm)
const BASE = BigInt(import.meta.env.VITE_BASE || 19);
const MODULUS = BigInt(import.meta.env.VITE_MODULUS || 4294967291);

let wasmModulation = null;

export async function initCryptoEngine() {
    if (wasmModulation) return true; // Already loaded

    try {
        const response = await fetch('/math_engine.wasm');
        const bytes = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(bytes);
        wasmModulation = wasmModule.instance.exports.modulation;
        console.log("Wasm Crypto Engine loaded successfully!");
        return true;
    } catch (err) {
        console.error('Failed to load Wasm Engine:', err);
        return false;
    }
}


export function generateRandomPrivateKey() {
    // Generate a random number between 1 and 100 for the prototype
    const randomNum = Math.floor(Math.random() * 100) + 1;
    // Wasm expects BigInts (unsigned long long)
    return BigInt(randomNum); 
}

export function getPublicKey(privateKeyBigInt) {
    if (!wasmModulation) throw new Error("Wasm engine not initialized!");
    // This runs your C++ code: modulation(5, privateKey, 23)
    const pubKeyBigInt = wasmModulation(BASE, privateKeyBigInt, MODULUS);
    return pubKeyBigInt.toString(); 
}

export function calculateSharedSecret(otherPublicKeyString, myPrivateKeyBigInt) {
    if (!wasmModulation) throw new Error("Wasm engine not initialized!");
    const otherPubKey = BigInt(otherPublicKeyString);
    // This runs your C++ code: modulation(otherPubKey, myPrivateKey, 23)
    const sharedSecret = wasmModulation(otherPubKey, myPrivateKeyBigInt, MODULUS);
    return sharedSecret.toString();
}


// Helper: Turn a password string into a Web Crypto API Key
async function deriveKeyFromPassword(password, saltUint8) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: saltUint8, iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
}

// Helper: Convert ArrayBuffer to Base64
function bufferToBase64(buffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}
// Helper: Convert Base64 to ArrayBuffer
function base64ToBuffer(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
}

export async function encryptPrivateKeyForVault(privateKeyString, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await deriveKeyFromPassword(password, salt);
    
    const encodedData = new TextEncoder().encode(privateKeyString);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv }, aesKey, encodedData
    );

    return {
        encrypted_private_key: bufferToBase64(encryptedBuffer),
        key_salt: bufferToBase64(salt),
        key_iv: bufferToBase64(iv)
    };
}

export async function decryptPrivateKeyFromVault(vault, password) {
    try {
        const salt = base64ToBuffer(vault.key_salt);
        const iv = base64ToBuffer(vault.key_iv);
        const encryptedBuffer = base64ToBuffer(vault.encrypted_private_key);
        
        const aesKey = await deriveKeyFromPassword(password, new Uint8Array(salt));
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: new Uint8Array(iv) }, aesKey, encryptedBuffer
        );
        
        return new TextDecoder().decode(decryptedBuffer);
    } catch (err) {
        throw new Error("Failed to decrypt vault. Incorrect password?");
    }
}

export async function deriveMessageKey(sharedSecretString) {
    // 1. Convert the shared secret string into bytes
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw", encoder.encode(sharedSecretString), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    
    // 2. Derive a secure AES-GCM key from it
    // We use a static salt here because the shared secret is already unique to the two users
    return window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: new TextEncoder().encode("suraksha-e2ee-chat"), iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
}

export async function encryptMessage(plainText, sharedSecretString) {
    // 1. Derive the actual AES key object from the shared secret
    const aesKey = await deriveMessageKey(sharedSecretString);
    
    // 2. Generate a new, random IV for this specific message
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // 3. Encrypt the message
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(plainText);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv }, aesKey, encodedData
    );
    
    // 4. Return both the IV and Ciphertext as a single JSON string
    // We base64 encode them so they can be easily sent over the network
    return JSON.stringify({
        iv: bufferToBase64(iv),
        ct: bufferToBase64(encryptedBuffer)
    });
}

export async function decryptMessage(encryptedJsonString, sharedSecretString) {
    let payload;
    try {
        payload = JSON.parse(encryptedJsonString);
    } catch (e) {
        // Not a JSON string, so it must be an unencrypted plaintext message
        return encryptedJsonString;
    }

    try {
        if (!payload.iv || !payload.ct) return encryptedJsonString; // Not encrypted format
        
        // 1. Derive the AES key
        const aesKey = await deriveMessageKey(sharedSecretString);
        
        // 2. Extract the IV and ciphertext from the payload
        const iv = base64ToBuffer(payload.iv);
        const encryptedBuffer = base64ToBuffer(payload.ct);
        
        // 3. Decrypt
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: new Uint8Array(iv) }, aesKey, encryptedBuffer
        );
        
        return new TextDecoder().decode(decryptedBuffer);
    } catch (err) {
        console.error("Decryption failed", err);
        return "[Encrypted Message]";
    }
}


export function generateGroupKey(targetUsers, startingSecret) {
    let currentSecret = startingSecret;
    const chain = [];

    for(let i = 0; i < targetUsers.length; i++){
        const user = targetUsers[i];
        currentSecret = calculateSharedSecret(user.identity_public_key, currentSecret);
        
        const newGroupKey = getPublicKey(currentSecret);

        chain.push({
            user_id: user.user_id,
            join_order: i+2,
            group_public_key: newGroupKey
        });
    }

    return chain;
}

export function catchUp(serverChain, myPrivateKey, myUserId){
    // 1. Find where you joined the group in the sequence
    const myIndex = serverChain.findIndex(row => row.user_id === myUserId);
    if (myIndex === -1) throw new Error("I am not in this group!");

    let currentSecret;

    // 2. Calculate the secret at the exact moment you joined
    if (myIndex === 0) {
        // If you are the creator, the initial secret was just your private key!
        currentSecret = myPrivateKey;
    } else {
        // If you were added later, you look at the Group Public Key of the person right BEFORE you.
        // You mix their Group Public Key with your Private Key.
        const keyBeforeMe = serverChain[myIndex - 1].group_public_key;
        currentSecret = calculateSharedSecret(keyBeforeMe, myPrivateKey);
    }

    // 3. Fast-forward the math for everyone who joined AFTER you
    // We loop through the chain starting from the person after you, all the way to the end.
    for (let i = myIndex + 1; i < serverChain.length; i++) {
        // We take their personal Identity Public Key and mix it into our running secret.
        const nextPersonIdentityKey = serverChain[i].identity_public_key;
        currentSecret = calculateSharedSecret(nextPersonIdentityKey, currentSecret);
    }
    
    // 4. We have reached the present day!
    return currentSecret;
}