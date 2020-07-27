import { Component, OnInit, ApplicationRef } from '@angular/core';
import { PushService } from '../servies/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mensajes: OSNotificationPayload[] = [];
  userID: string;
  constructor(private pushService: PushService, private applicationRef: ApplicationRef) {}

  ngOnInit() {
    this.pushService.pushListener.subscribe(notificacion => {
      this.mensajes.unshift(notificacion);
      this.applicationRef.tick(); // Le dice a angular que detecte los cambios nuevamente
    });
  }

  async ionViewWillEnter() {
    console.log('ionViewWillEnter cargar mensajes');
    this.mensajes = await this.pushService.getMensajes();
    this.userID = this.pushService.getUserID();
  }

  async borrarMensajes() {
    await this.pushService.borrarMensajes();
    this.mensajes = [];
  }
}
