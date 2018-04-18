Template.form_new_note.events({
	'submit .js-new-note'(event, instance){

		event.preventDefault();
		moment.locale('fr');
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

		today = dd + '/' + mm + '/' + yyyy;
		console.log(today);

		const date =  moment(event.target.date.value).format('L');
		if(!date){ alert("Veuillez saisir la date d'enregistrement svp !"); stop.propagation();}		

		const exp = event.target.exp.value;
		if(!exp){ alert("Veuillez saisir l'expéditeur svp !"); stop.propagation();}

		const dest = event.target.dest.value;
		if(!dest){ alert("Veuillez saisir le destinataire svp !"); stop.propagation();}

		const objet = event.target.objet.value;
		if(!objet){ alert("Veuillez saisir l'objet du courrier svp !"); stop.propagation();}

		const deadline = moment(event.target.deadline.value).format('L');
		const obs = event.target.obs.value;
		const traite = event.target.traite.value;

		Notes.insert({
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
	},
});

Template.list_note.helpers({
	notes(){
		return Notes.find().fetch();
	},
});

Template.single_note.events({
	'click .js-edit-note'(event, instance){
		console.log(instance.data);
		// ici modal permet d'ouvrir une fenetre de modification de champs
		Modal.show('modal_edit_note', instance.data); // instance.data sert à accéder aux valeurs du texte
	},
});

// la confirmation de la sauvergarde est appelée et update la bdd
Template.modal_edit_note.events({
	'submit .js-edit-note' (event, instance){
		event.preventDefault();

		const Id_note = instance.data.note._id; // ici on créé une variable qui permet de recupérer l'id de la ligne modifiée.
	
		Notes.update({ 
			_id: Id_note}, {
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

	'click .js-delete-note' (event, instance){

		var reponse = window.confirm("Attention cette suppression sera définitive, confirmez vous la suppression ?")

		if(reponse == true){
			Notes.remove({_id: instance.data.note._id});}
  
		Modal.hide();
	}
});





/* 
// templates des boutons de tri
Template.courriers.events({
	'click .js-courriers-note'(event, instance){
	// Notes.find().fetch() -- attention pas de doublon avec list-note.helpers... !
	},
});/*

/*
Template.encours.events({
	'click .js-encours-note'(event, instance){
		Notes.find({}, {sort: {traite: -1}}).fetch() ;
	},
});*/
/*
Template.actuel.events({
	'click .js-actuel-note'(event, instance){
	// Notes.find().fetch() where note.traite == currentDate
	},
});*/

/*
Template.depasse.events({
	'click .js-depasse-note'(event, instance){
	//Notes.find().fetch(); where note.traite < currentDate
	//},
});*/


/*partie a revoir
Template.form_search_note.events({
	'click .js-form-search'(event, instance){
		event.preventDefault();
		const search = event.target.search.value;
	},
});
*/



