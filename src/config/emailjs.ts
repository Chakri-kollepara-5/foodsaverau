import emailjs from '@emailjs/browser';

export const emailConfig = {
  serviceId: 'service_k1vmum4',
  templateId: 'template_vn9qy4b',
  publicKey: 'JyYK-zQkdAL7EXvrW'
};

// Initialize EmailJS
emailjs.init(emailConfig.publicKey);

export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  try {
    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      from_name: 'FoodShare Team',
      message: `Welcome to FoodShare! Thank you for joining our mission to reduce food waste and help communities in need.`
    };

    await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      templateParams
    );
    
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};

export const sendDonationConfirmation = async (userEmail: string, donationDetails: any) => {
  try {
    const templateParams = {
      to_email: userEmail,
      to_name: donationDetails.donorName,
      from_name: 'FoodShare Team',
      message: `Your food donation "${donationDetails.foodType}" has been successfully posted and is now available for pickup by NGOs and volunteers.`
    };

    await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      templateParams
    );
  } catch (error) {
    console.error('Failed to send donation confirmation:', error);
  }
};

export const sendPickupNotification = async (userEmail: string, pickupDetails: any) => {
  try {
    const templateParams = {
      to_email: userEmail,
      to_name: pickupDetails.ngoName,
      from_name: 'FoodShare Team',
      message: `You have successfully claimed a food donation. Please coordinate with the donor for pickup at ${pickupDetails.location}.`
    };

    await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      templateParams
    );
  } catch (error) {
    console.error('Failed to send pickup notification:', error);
  }
};