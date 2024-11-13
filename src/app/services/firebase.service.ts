import { Injectable, inject } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile,sendPasswordResetEmail} from 'firebase/auth';
import { User } from '../models/user.model';
import { Paciente } from '../models/pacientes.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {getFirestore, setDoc, doc, getDoc,addDoc,collection, collectionData, query, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {getStorage,uploadString,ref,getDownloadURL, deleteObject } from 'firebase/storage'
import { Admin } from '../models/admin.model';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore)
  storage = inject(AngularFireStorage)
  utilsSvc = inject(UtilsService)

  //AUTENTICACION
  getAuth() {
    return getAuth();
  }

  // ACCEDER

  signIn(user:User) {
    return signInWithEmailAndPassword(getAuth(), user.email,user.password)
  }



  // CREACION DE USUARIO

  signUp(user:User) {
    return createUserWithEmailAndPassword(getAuth(), user.email,user.password)
  }

  //ACTUALIZAR USUARIO
  updateUser(displayName:string) {
    return updateProfile(getAuth().currentUser,{displayName})
  }

  //RESTABLECER CONTRASEÑA

  sendRecoveryEmail(email:string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  //CERRAR SESSION
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/seleccion-user')
  }



  //BASE DE DATOS

  ///====OBTENER DOCUMENTOS DE UNA COLECCION ====///
  getCollectionData(path:string, collectionQuery?: any) {
    const ref = collection(getFirestore(),path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});
  }

  getData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(collectionQuery || ref, { idField: 'id' });
}


  // Método para obtener la última tasa de cambio desde `tasa_dolar` usando el campo `valor_local`
  getUltimaTasaCambio(): Observable<number> {
    return this.firestore.collection('tasa_dolar', ref => ref.orderBy('timestamp', 'desc').limit(1))
      .valueChanges()
      .pipe(
        map((tasas: any[]) => tasas.length > 0 ? tasas[0].valor_local : 0)
      );
  }


  //SETEAR DOCUMENTOS

  setDocument(path:string ,data:any) {
    return setDoc(doc(getFirestore(),path),data);
  }

    //ACTUALIZAR DOCUMENTOS

    updateDocument(path:string ,data:any) {
      return updateDoc(doc(getFirestore(),path),data);
    }

        //ELIMINAR DOCUMENTOS

        deleteDocument(path:string) {
          return deleteDoc(doc(getFirestore(),path));
        }

  // OBTENER DOCUMENTOS

  async getDocument(path:string) {
    return (await getDoc(doc(getFirestore(),path))).data();
  }

    // Nuevo método para obtener datos en tiempo real con snapshotChanges
    getCollectionSnapshot(path: string): Observable<any> {
      return this.firestore.collection(path).snapshotChanges();
    }

  //AGREGAR UN DOCUMENTO
  addDocument(path:string ,data:any) {
    return addDoc(collection(getFirestore(),path),data);

  }

  // addPaciente(data: any) {
  //   return this.firestore.collection('pacientes').add(data);
  // }

  //ALMACENAMIENTO

  ///SUBIR IMAGEN
 async uploadImage(path: string,data_url:string) {
    return uploadString(ref(getStorage(),path), data_url,'data_url').then(() => {
      return getDownloadURL(ref(getStorage(),path))
    })


  }
  ////OBTENER RUTA DE LA IMAGEN  CON SU URL////
  async getFilePath(url:string) {
    return ref(getStorage(), url).fullPath
  }

  ////ELIMINAR ARCHIVO////
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

      /////////////////VALIDAR REGISTRO//////////////////
      getUserByCedulaOrEmail(cedula: string, email: string): Promise<any> {
        return this.firestore.collection('users').ref.where('cedula', '==', cedula).get().then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            return querySnapshot.docs[0].data();
          } else {
            return this.firestore.collection('users').ref.where('email', '==', email).get().then((querySnapshot) => {
              if (querySnapshot.docs.length > 0) {
                return querySnapshot.docs[0].data();
              } else {
                return null;
              }
            });
          }
        });
      }
///////////////////VALIDAR INICIO DE SESION///////////////////
      async userExists(email: string): Promise<boolean> {
        return this.firestore.collection('users').ref.where('email', '==', email).get().then((querySnapshot) => {
          return querySnapshot.docs.length > 0;
        });
      }

      async getDocumentByName(collectionPath: string, field: string, value: string): Promise<any> {
        const collectionRef = this.firestore.collection(collectionPath, ref => ref.where(field, '==', value));

        return new Observable((observer) => {
          collectionRef.get().subscribe({
            next: (snapshot) => {
              if (snapshot.empty) {
                console.log(`No se encontraron documentos con ${field} = ${value}`);
                observer.next(null); // Enviar un valor nulo si no hay documentos
              } else {
                const document = snapshot.docs[0]; // Obtener el primer documento
                observer.next(document.data()); // Enviar los datos del primer documento
              }
            },
            error: (err) => {
              console.error('Error al obtener el documento:', err);
              observer.error(err); // Manejo de errores
            },
            complete: () => observer.complete(), // Completar la suscripción
          });
        }).toPromise(); // Retorna un Promise para usar async/await
      }

  collectionQuery(path: string, field: string, operator: any, value: any): Observable<any[]> {
    return this.firestore.collection(path, ref => ref.where(field, operator, value)).valueChanges();
  }

  async queryCollection(collectionPath: string, field: string, value: any): Promise<any[]> {
    const snapshot = await this.firestore
      .collection(collectionPath, ref => ref.where(field, '==', value))
      .get()
      .toPromise();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  }


      getDocumentByField(collectionPath: string, field: string, value: any): Observable<any> {
        return this.firestore.collection(collectionPath, ref => ref.where(field, '==', value))
          .snapshotChanges()
          .pipe(
            map(actions => {
              const doc = actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                if (data && typeof data === 'object') {
                  return { id, ...data };
                } else {
                  return { id, data };
                }
              })[0];
              return doc;
            })
          );
      }


      ///////////////////VALIDAR INICIO DE SESION PARA ADMIN///////////////////
      async AdminExists(email: string): Promise<boolean> {
        return this.firestore.collection('admin').ref.where('email', '==', email).get().then((querySnapshot) => {
          return querySnapshot.docs.length > 0;
        });
      }



}
