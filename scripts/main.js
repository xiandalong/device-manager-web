function DeviceManager() {
    this.deviceList = document.getElementById("device-list");
    this.database = firebase.database();
    this.loadDevices();
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

window.onload = function () {
    window.deviceManager = new DeviceManager();
};