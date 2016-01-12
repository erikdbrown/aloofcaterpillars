FileStructure

Auth => Standard sign in/signout with JWT tokens.
	
	1. Note that token includes a "username" object via
		$window.localStorage.setItem('com.oneAppUser', token.username);

		This was to ensure that we could send queries and filter back to DB
		This might not be relevant any longer if you end up refactoring to SQL

	2. Password view is not secure. Should probably change that.

	3. Logout procedures wipe both tokens back to empty strings

BootstrapJS => This is boilerplate JS for bootstrap

Browse => Contains code for both viewing requests and available foods for trade
	
	Browse
	
		1. BrowseJS/HTML => uses GET request from factory to show meals available

		2. Filters by meals that are NOT the user's.

		3. TODO: Implement filters on the backend OR abstract filters into a factory

	View => Biggest challenge in this doc is dynamically rendering HTML. 

		1. Note again that filters are implemented on the viewCtrl

		2. In HTML => Switches views on ng-click. It might be better to just render a new view below (or next to) the original view

		3. NOTE: Passing any meal back to the DB will not work due to the picture upload feature being too large for Angular to handle

		If you need to send a POST/PUT, send just the meal's title or creator. We can GET the full breadth of data, just cannot send it back :\

Factories =>

	1. Contains routes to DB for all GET/POST/PUT

	2. Contains routes for AUTH. Taken from AngularShortly's Auth strategy

Fonts/Images =>

	1. Imported for the AISHA HTML5 Bootstrap Template. Feel free to strip if you want to change the landing page

Styles =>

	1. Imported from numerous libraries to make the landing page gangster.
	2. Used the following libraries
		a. Material Design for cards
		b. Aisha Bootstrap template
		c. FMP-card directive for one version of flip cards
		d. Toggling cards on:hover via this guy
		http://callmenick.com/post/image-captions-that-reveal-with-css3-transitions

THE ENNDDDDD


	