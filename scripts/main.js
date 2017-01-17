function DeviceManager() {
    this.deviceList = document.getElementById("device-list");
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');

    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    this.initFirebase();
    // this.loadDevices();
};

DeviceManager.prototype.initFirebase = function () {
    this.database = firebase.database();
    this.auth = firebase.auth();
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

DeviceManager.prototype.loadDevices = function () {
    this.devicesRef = this.database.ref("devices");
    this.devicesRef.off();

    var setDevice = function (data) {
        var val = data.val();
        this.displayDevice(data.key, val.modelName, val.manufacturerName, val.androidCodeName, val.owner);
    }.bind(this);
    this.devicesRef.on('child_added', setDevice);
    this.devicesRef.on('child_changed', setDevice);
};

DeviceManager.MESSAGE_TEMPLATE =
    '<tr class="device-container">' +
    '<th class="model-name"></th>' +
    '<th class="manufacturer-name"></th>' +
    '<th class="android-code-name"></th>' +
    '<th class="owner-name"></th>' +
    '<th class="owner-email"></th>' +
    '</tr>';

DeviceManager.prototype.displayDevice = function (key, modelName, manufacturerName, androidCodeName, owner) {
    var row = document.getElementById(key);
    // If an element for that message does not exists yet we create it.
    if (!row) {
        row = document.createElement('tr');
        row.innerHTML = DeviceManager.MESSAGE_TEMPLATE;
        row.setAttribute('id', key);
        this.deviceList.appendChild(row);
    }
    var modelNameText = modelName ? modelName : 'NA';
    var manufacturerNameText = manufacturerName ? manufacturerName : 'NA';
    var androidCodeNameText = androidCodeName ? androidCodeName : 'NA';
    var ownerNameText = owner ? owner.fullName : 'NA';
    var ownerEmailText = owner ? owner.email : 'NA';
    row.querySelector('.model-name').textContent = modelNameText;
    row.querySelector('.manufacturer-name').textContent = manufacturerNameText;
    row.querySelector('.android-code-name').textContent = androidCodeNameText;
    row.querySelector('.owner-name').textContent = ownerNameText;
    row.querySelector('.owner-email').textContent = ownerEmailText;
};

DeviceManager.prototype.signIn = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

DeviceManager.prototype.signOut = function () {
    this.auth.signOut();
    this.deviceList.innerHTML = '';
};

DeviceManager.prototype.onAuthStateChanged = function (user) {
    if (user) {
        var profilePicUrl = user.photoURL;
        var userName = user.displayName;

        this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
        this.userName.textContent = userName;

        this.userName.removeAttribute('hidden');
        this.userPic.removeAttribute('hidden');
        this.signOutButton.removeAttribute('hidden');

        this.signInButton.setAttribute('hidden', 'true');

        this.loadDevices();
    } else {
        this.userName.setAttribute('hidden', 'true');
        this.userPic.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');

        this.signInButton.removeAttribute('hidden');
    }
}

window.onload = function () {
    window.deviceManager = new DeviceManager();
};