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


Template.form_new_notes.events({
	'submit .js-new-note'(event, instance){

		event.preventDefault();
		moment.locale('fr');

		console.log('today:' + today);

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

		console.log('deadline : ' + deadline);	

		let obs = event.target.obs.value;
		let traite = event.target.traite.value;

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

Template.single_notes.events({
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

		let Id_note = instance.data.note._id; // ici on créé une variable qui permet de recupérer l'id de la ligne modifiée.
	
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

Template.list_notes.helpers({
	notes(){
		return Notes.find().fetch();
	},
	// compteur des courriers
	count() {
    	return Notes.find({}).count(); // ok nombre de courriers
  	},
  	// compteur des courriers a traiter
	incompleteCount() {
    	return Notes.find( { traite: { $eq: ''  } }).count( ); //ok - nbre sans réponse envoyée
  	},
   	// compteur des courriers avec réponse ce jour. - ok
  	todayCount() {
  		
    	return Notes.find({ deadline: { $eq:today } }).count();
  	},

  	 // compteur des réponses hors délai.
  	deadlineCount() {
  		
    	return Notes.find({ deadline: {$lt: today } }).count();

    	//$or: [{end_date: null}, {end_date: {$gte: 1376982000}}]
    	
  	},
 
});