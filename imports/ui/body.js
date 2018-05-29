import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Lettres } from '../api/lettres.js';

import './body.html';
// ici on declare des variables qui appellent 
//la methode reactive dict et renvoi le résultat

var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //Janvier = 0 
    var yyyy = today.getFullYear();
      if(dd<10) {
        dd = '0'+dd
      } 
      if(mm<10) {
        mm = '0'+mm
      } 
    today = dd + '/' +mm + '/' + yyyy;

var pageSession = new ReactiveDict();
var lettres = Lettres.find({}, {sort: {date: -1, dest:1}} );
var lettres1 = Lettres.find({deadline: today}, {sort: {date: -1, dest:1}} ); // du jour
var lettres2 = Lettres.find({deadline: {$gt: today} } , {sort: {date: -1, dest:1}} ); //futur
var lettres3 = Lettres.find({deadline: {$lt: today} }, {sort: {date: -1, dest:1}} ); // passé
var lettres4 = Lettres.find({ traite: {$eq: "" } }, {sort: {date: -1, dest:1}} );//non traité
var lettres5 = Lettres.find({ traite: {$ne: "" } }, {sort: {date: -1, dest:1}} ); // traité
// appel de la fonction search
var LettresViewItems = function(cursor){
    if(!cursor){
      return [];
    }

    // mémo:pageSession est la var qui appelle le reactivedict
    var searchString = pageSession.get("LettresViewSearchString");

    var raw = cursor.fetch();

    var filtered = [];

    if(!searchString || searchString == ""){
      filtered = raw; // idem: filtered = cursor.fetch();
    } else {

      // info: transfo des potentiels searchString en ignorant les . pour le codes
      searchString = searchString.replace(".", "\\.");

      var regEx = new RegExp(searchString, "i"); // sert à ne pas prendre en compte la casse du mot recherché
      var searchFields = ["dest", "objet", "exp", "obs"];

      filtered = _.filter(raw, function(item){

          var match = false;

          _.each(searchFields, function(field){

              var value = (getPropertyValue(field, item) || "") + "";

              match = match || (value && value.match(regEx));
              
              if(match){
              return false;
              }
          })
        return match;

      });
      // fin du else
    }
     
      return filtered;
};

Template.navbar.events({

	'submit .new-task'(event){
		event.preventDefault();

    let date =  moment(event.target.date.value).format('DD/MM/YYYY');
    if(!date){ alert("Veuillez saisir la date d'enregistrement svp !"); stop.propagation();}  
    console.log('date : ' + date);    

    let exp = event.target.exp.value;
    if(!exp){ alert("Veuillez saisir l'expéditeur svp !"); stop.propagation();}

    let dest = event.target.dest.value;
    if(!dest){ alert("Veuillez saisir le destinataire svp !"); stop.propagation();}

    let objet = event.target.objet.value;
    if(!objet){ alert("Veuillez saisir l'objet du courrier svp !"); stop.propagation();}

    let deadline = moment(event.target.deadline.value).format('DD/MM/YYYY');
    let obs = event.target.obs.value;
    let traite = event.target.traite.value;
    
   console.log(dest);
   console.log(exp);
   console.log(objet);
	
    if(dest !=''){
  		  Lettres.insert({
  			  date:date,
          exp: exp,
          dest: dest,
          objet: objet,
          deadline: deadline,
          obs: obs,   
          traite: traite,       
  			});

		  event.target.date.value = '';
      event.target.exp.value = '';
      event.target.dest.value = '';
      event.target.objet.value = '';
      event.target.deadline.value = '';   
      event.target.obs.value = '';
      event.target.traite.value = '';
       }
	},





  'keydown .search': function(e, t){
    // === 13 : Enter
    if(e.which === 13)
    {
      e.preventDefault();
      var form = $(e.currentTarget).parent();
      if(form) {
        var searchInput = form.find("#search-input");
        if(searchInput) {
          var searchString = searchInput.val();
          pageSession.set("LettresViewSearchString", searchString);
        }
      }
      return false;
    }
    // === 27 : "Escape"
    if(e.wich === 27){
      event.preventDefault();
      var form = $(e.currentTarget).parent();
        if(form){
          var searchInput = form.find("#search-input");
            if(searchInput){
            searchInput.val("");
            pageSession.set("LettresViewSearchString", "");
        }
    }
    return false;
    }
  return true; // donc envoi du submit
  },
});

Template.complete.helpers({
  LettresFiltered(){
    return LettresViewItems(lettres);
    }
});
Template.today.helpers({
  todayFiltered(){
    return LettresViewItems(lettres1);
    }
});
Template.tomorrow.helpers({
  tomorrowFiltered(){
    return LettresViewItems(lettres2);
    }
});
Template.past.helpers({
  pastFiltered(){
    return LettresViewItems(lettres3);
    }
});

Template.processed.helpers({
  processedFiltered(){
    return LettresViewItems(lettres5);
    }
});

Template.noProcessed.helpers({
  noProcessedFiltered(){
    return LettresViewItems(lettres4);
    }
});

Template.navbar.helpers({ 
  count() {
    return Lettres.find({}).count(); // ok nombre de courriers
  },
  // compteur des réponses hors délai.
  todayCount() { 
    return Lettres.find({ deadline: {$eq: today } }).count();
  },
  tomorrowCount() { 
    return Lettres.find({ deadline: {$gt: today } }).count();
  },
  pastCount() { 
    return Lettres.find({ deadline: {$lt: today } }).count();
  },
  processedCount() { 
    return Lettres.find({ traite: {$ne: "" } }).count();
  },
  noProcessedCount() { 
    return Lettres.find({ traite: {$eq: "" } }).count();
  }
})
 
Template.lettre.events({
  'click .list-courrier'(event, instance){
    console.log(instance.data);
    // ici modal permet d'ouvrir une fenetre de modification de champs
    Modal.show('modal_show_courrier', instance.data); // instance.data sert à accéder aux valeurs du texte
  }
});

Template.modal_show_courrier.events({
  'submit .js-edit-courrier' (event, instance){
    event.preventDefault();

    var Id_courrier = instance.data._id; // ici on créé une variable qui permet de recupérer l'id de la ligne modifiée.
    // la confirmation de la sauvergarde est appelée et update la bdd
    Lettres.update({ 
      _id: Id_courrier}, {
      $set:{
        date: event.target.date.value,
        exp: event.target.exp.value,
        dest: event.target.dest.value,
        objet: event.target.objet.value,
        deadline: event.target.deadline.value,
        obs: event.target.obs.value,
        traite: event.target.traite.value
      }
    });

    Modal.hide();
  },

  'click .js-delete-courrier' (event, instance){

    var reponse = window.confirm("Attention cette suppression sera définitive, confirmez vous la suppression ?")

    if(reponse == true){
      Lettres.remove({_id: instance.data._id});}
  
    Modal.hide();
  }
});

 