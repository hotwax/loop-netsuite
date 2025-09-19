import { translate } from '@/i18n';
import { Plugins } from '@capacitor/core';
import { toastController } from '@ionic/vue';

const showToast = async (message: string, configButtons?: any) => {
  const defaultButtons = [{
    text: 'Dismiss',
    role: 'cancel'
  }]

  if (configButtons) defaultButtons.push(...configButtons);

  const toast = await toastController
    .create({
      message: message,
      duration: 3000,
      position: 'top',
      buttons: defaultButtons
    })
  return toast.present();
}

const isValidEmail = (email : string) => {
  // Regular expression pattern for a valid email address
  const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailPattern.test(email);
}

const isValidPassword = (password : string) => {
  // Regular expression pattern for a valid password
  const passwordPattern = /^.*(?=.{5,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/;
  return passwordPattern.test(password);
}

const copyToClipboard = async (text: any, showCopiedValue = true) => {
  const { Clipboard } = Plugins;

  await Clipboard.write({
    string: text,
  }).then(() => {
    if(showCopiedValue) {
      showToast(translate(`${translate("Copied")}: ${text}`));
    } else {
      showToast(translate("Copied to clipboard"));
    }
  });
}

export { showToast, isValidEmail, isValidPassword, copyToClipboard }