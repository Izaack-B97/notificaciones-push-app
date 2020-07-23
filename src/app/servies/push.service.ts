import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.cargarMensajes();
  }

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Este es el body de la push',
    //   date: new Date()
    // }
  ];

  pushListener = new EventEmitter<OSNotificationPayload>(); // Emite un evento

  // Inicializarion del OneSignal para los push
  configuracionInicial(){
    this.oneSignal.startInit('b59cef6a-c811-4a6a-89c1-746a8639255f', '999894757225'); // (app-id, googleprojectNumber)

    // Te despliega la notificacion en un alert o notificacion normal
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    // Lo que se hace cuando se recibe la notificacion
    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
    // do something when notification is received
      console.log('Notificacion recibida', noti);
      this.notificacionrecibida(noti);
    });

    // Se ejecuta cuando la notificacion es abierta
    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log('notificacion abierta', noti);
    });

    this.oneSignal.endInit();
  }

  // Manejamos la notificaciones
  async notificacionrecibida(noti: OSNotification){
    await this.cargarMensajes();
    console.log('Estas recibiendo una notificacion');
    const payload = noti.payload;
    // const existePush = this.mensajes.filter(mensaje => mensaje.notificationID === payload.notificationID);
    // console.log('Antes del if', existePush);
    // if (existePush) {
    //   console.log('Estoy dentro');
    //   return;
    // }

    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);

    console.log('Estas pasando el emit');

    this.guardarMensaje();
  }

  guardarMensaje() {
    this.storage.set('mensajes', this.mensajes);
    console.log('Estas guardando mensajes . . .');
  }

  async cargarMensajes() {
    this.mensajes = await this.storage.get('mensajes') || [];
    console.log(this.mensajes);
  }

  async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes];
  }

}
