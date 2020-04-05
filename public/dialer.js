(function() {

new Vue({
  // Specify element for the dialer control
  el: '#dialer',

  // State data for dialer component
  data: {
    studentName: 'Válassz diákot',
    studentId: '-1',
    muted: false,
    onPhone: false,
    log: 'Betöltés...',
    students: [
      { name: 'András', id: '0' },
      { name: 'Fruzsi', id: '1' },
      { name: 'Tamás', id: '2' },
    ],
    connection: null
  },

  // Initialize after component creation
  created: function() {
    var self = this;

    // Fetch Twilio capability token from our Node.js server
    $.getJSON('/token').done(function(data) {
      Twilio.Device.setup(data.token);
    }).fail(function(err) {
      console.log(err);
      self.log = 'Nem sikerült hozzáférést szerezni, lásd a naplót';
    });

    // Configure event handlers for Twilio Device
    Twilio.Device.disconnect(function() {
      self.onPhone = false;
      self.connection = null;
      self.log = 'A hívás véget ért';
    });

    Twilio.Device.ready(function() {
      self.log = 'Hívásra kész';
    });
  },

  methods: {
    selectStudent: function(student) {
      this.studentName = student.name;
      this.studentId = student.id;
    },

    // Handle muting
    toggleMute: function() {
      this.muted = !this.muted;
      Twilio.Device.activeConnection().mute(this.muted);
    },

    // Make an outbound call with the current number,
    // or hang up the current call
    toggleCall: function() {
      if (!this.onPhone) {
        this.muted = false;
        this.onPhone = true;
        this.connection = Twilio.Device.connect({ studentId: this.studentId });
        this.log = 'Hívás folyamatban'
      } else {
        // hang up call in progress
        Twilio.Device.disconnectAll();
      }
    },

    // Handle numeric buttons
    sendDigit: function(digit) {
      this.connection.sendDigits(digit);
    },

  }
});

})();
