export default class Notifier {
  hasPermission() {
    return Notification.permission === 'granted';
  }

  requestPermission() {
    // notifications not supported
    if (!window.Notification) return;

    // check if permission is already granted
    if (this.hasPermission()) return;

    // request permission from user
    Notification.requestPermission().then(function(p) {
      if(p !== 'granted') return;
    }).catch(function(err) {
      console.error("Notification permission request error", err);
    });
  }

  sendNotification(bodyText, api_host) {
    if (!this.hasPermission()) return;
    const note = new Notification(
      "A site changed!", {
        body: bodyText,
        dir: 'auto', // or ltr, rtl
        lang: 'EN', //lang used within the notification.
        tag: 'notificationPopup', //An element ID to get/set the content
        icon: '' //The URL of an image to be used as an icon
      }
    );
    new Audio(`${api_host}/assets/bell.oga`).play();
  }
}
