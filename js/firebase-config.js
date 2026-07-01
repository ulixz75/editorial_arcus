// ============================================
// FIREBASE CONFIGURATION - ACTIVADO
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyCxRU1Vu1CfCjLeuQVIlJEllZfPDo6uEss",
    authDomain: "professional-ebook-shop.firebaseapp.com",
    projectId: "professional-ebook-shop",
    storageBucket: "professional-ebook-shop.firebasestorage.app",
    messagingSenderId: "106178721927",
    appId: "1:106178721927:web:e2cdf9e4e402c9b124e022"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ============================================
// AUTENTICACIÓN
// ============================================

// Registrar nuevo usuario con email/password
async function registerUser(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Actualizar perfil con nombre
        if (displayName) {
            await updateProfile(user, { displayName });
        }
        
        // Guardar datos adicionales en Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: email,
            displayName: displayName || '',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            preferences: {
                language: currentLanguage || 'es',
                notifications: true
            }
        });
        
        console.log('✅ Usuario registrado exitosamente:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        return { 
            success: false, 
            error: getErrorMessage(error.code),
            code: error.code 
        };
    }
}

// Iniciar sesión con email/password
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Actualizar último login
        await updateDoc(doc(db, 'users', user.uid), {
            lastLogin: serverTimestamp()
        });
        
        console.log('✅ Usuario autenticado:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Error al iniciar sesión:', error);
        return { 
            success: false, 
            error: getErrorMessage(error.code),
            code: error.code 
        };
    }
}

// Iniciar sesión con Google
async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Verificar si es la primera vez que inicia sesión
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
            // Primera vez - crear perfil
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                preferences: {
                    language: currentLanguage || 'es',
                    notifications: true
                }
            });
        } else {
            // Ya existe - actualizar último login
            await updateDoc(doc(db, 'users', user.uid), {
                lastLogin: serverTimestamp()
            });
        }
        
        console.log('✅ Usuario autenticado con Google:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Error al iniciar sesión con Google:', error);
        return { 
            success: false, 
            error: getErrorMessage(error.code),
            code: error.code 
        };
    }
}

// Cerrar sesión
async function logoutUser() {
    try {
        await signOut(auth);
        console.log('✅ Sesión cerrada exitosamente');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        return { success: false, error: error.message };
    }
}

// Observador de estado de autenticación
function setupAuthObserver(callback) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Usuario autenticado
            console.log('👤 Usuario autenticado:', user.email);
            
            // Obtener datos adicionales de Firestore
            const userData = await getUserData(user.uid);
            
            callback({ 
                authenticated: true, 
                user,
                userData: userData.success ? userData.data : null
            });
        } else {
            // Usuario no autenticado
            console.log('👤 Usuario no autenticado');
            callback({ authenticated: false, user: null, userData: null });
        }
    });
}

// Obtener datos del usuario
async function getUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: 'Usuario no encontrado' };
        }
    } catch (error) {
        console.error('❌ Error al obtener datos del usuario:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// FAVORITOS
// ============================================

// Guardar favoritos en Firestore
async function saveFavorites(userId, favorites) {
    try {
        await setDoc(doc(db, 'users', userId, 'data', 'favorites'), {
            bookIds: favorites,
            lastUpdated: serverTimestamp()
        });
        
        console.log('✅ Favoritos guardados:', favorites.length);
        return { success: true };
    } catch (error) {
        console.error('❌ Error al guardar favoritos:', error);
        return { success: false, error: error.message };
    }
}

// Obtener favoritos de Firestore
async function getFavorites(userId) {
    try {
        const favDoc = await getDoc(doc(db, 'users', userId, 'data', 'favorites'));
        
        if (favDoc.exists()) {
            return { success: true, favorites: favDoc.data().bookIds || [] };
        } else {
            return { success: true, favorites: [] };
        }
    } catch (error) {
        console.error('❌ Error al obtener favoritos:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// HISTORIAL DE COMPRAS
// ============================================

// Guardar compra en Firestore
async function savePurchaseHistory(userId, purchaseData) {
    try {
        const purchase = {
            userId: userId,
            items: purchaseData.items.map(item => ({
                bookId: item.id,
                title_es: item.title_es,
                title_en: item.title_en,
                price: item.price,
                quantity: item.quantity,
                cover: item.cover
            })),
            subtotal: purchaseData.subtotal,
            tax: purchaseData.tax,
            total: purchaseData.total,
            stripeSessionId: purchaseData.stripeSessionId || null,
            paymentStatus: purchaseData.paymentStatus || 'completed',
            purchaseDate: serverTimestamp(),
            deliveryStatus: 'completed', // Libros digitales se entregan inmediatamente
            downloadLinks: purchaseData.downloadLinks || []
        };
        
        const docRef = await addDoc(collection(db, 'purchases'), purchase);
        
        console.log('✅ Compra guardada con ID:', docRef.id);
        return { success: true, purchaseId: docRef.id };
    } catch (error) {
        console.error('❌ Error al guardar compra:', error);
        return { success: false, error: error.message };
    }
}

// Obtener historial de compras del usuario
async function getUserPurchases(userId) {
    try {
        const q = query(
            collection(db, 'purchases'), 
            where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(q);
        const purchases = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            purchases.push({ 
                id: doc.id, 
                ...data,
                purchaseDate: data.purchaseDate?.toDate() || new Date()
            });
        });
        
        // Ordenar por fecha (más reciente primero)
        purchases.sort((a, b) => b.purchaseDate - a.purchaseDate);
        
        console.log(`✅ ${purchases.length} compras encontradas`);
        return { success: true, purchases };
    } catch (error) {
        console.error('❌ Error al obtener compras:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// MENSAJES DE ERROR TRADUCIDOS
// ============================================

function getErrorMessage(errorCode) {
    const errors = {
        'auth/email-already-in-use': 'Este email ya está registrado',
        'auth/invalid-email': 'Email inválido',
        'auth/operation-not-allowed': 'Operación no permitida',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
        'auth/popup-closed-by-user': 'Ventana de autenticación cerrada',
        'auth/cancelled-popup-request': 'Solicitud cancelada'
    };
    
    return errors[errorCode] || 'Error desconocido. Intenta de nuevo.';
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

export { 
    auth, 
    db, 
    registerUser, 
    loginUser,
    loginWithGoogle,
    logoutUser,
    setupAuthObserver,
    getUserData,
    saveFavorites,
    getFavorites,
    savePurchaseHistory, 
    getUserPurchases
};
