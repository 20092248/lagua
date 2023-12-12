import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  helpCards: any[] = [{title: 'Premiers pas', subtitle: 'Tout ce qu\'il faut pour accéder à l\'application Lagua', route: '/help/firststep'},
  {title: 'Gestion des comptes', subtitle: 'Gère ton compte, ton activité et ton abonnement', route: '/help/accountmanagement'},
  {title: 'Apprentissage', subtitle: 'Explore les différentes méthode pour apprendre le comorien', route: '/help/learning'},
  {title: 'Révision', subtitle: 'Découvre comment utiliser les outils de répétition pour améliorer tes compétences', route: '/help/reviewing'},
  {title: 'Nous contacter', subtitle: 'Contacte l\'équipe Lagua', route: '/help/contactus'}] 

  constructor() { }

  ngOnInit() {
  }

}
