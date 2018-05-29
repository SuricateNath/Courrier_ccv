Router.configure({
	layoutTemplate: 'main_layout'	
});

Router.route('/', function(){
	this.render('navbar')
});

Router.route('/today', function(){
	this.render('today')
});

Router.route('/complete', function(){
	this.render('complete')
});

Router.route('/tomorrow', function(){
	this.render('tomorrow')
});

Router.route('/past', function(){
	this.render('past')
});
Router.route('/processed', function(){
	this.render('processed')
});

Router.route('/noProcessed', function(){
	this.render('noProcessed')
});