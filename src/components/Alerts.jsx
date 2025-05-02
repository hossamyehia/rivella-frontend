import Swal from 'sweetalert2';

// Configure global settings
const configureSweetAlert = () => {
  Swal.mixin({
    customClass: {
      confirmButton: 'MuiButton-containedPrimary',
      cancelButton: 'MuiButton-outlinedSecondary',
      title: 'sweet-alert-title',
      content: 'sweet-alert-content'
    },
    buttonsStyling: false,
    reverseButtons: true,
    confirmButtonText: 'موافق',
    cancelButtonText: 'إلغاء',
    heightAuto: false
  });

  // Add CSS for RTL support
  const style = document.createElement('style');
  style.innerHTML = `
    .swal2-popup {
      font-family: 'Tajawal', 'Roboto', sans-serif;
      direction: rtl;
    }
    .swal2-actions {
      flex-direction: row-reverse;
    }
    .MuiButton-containedPrimary {
      background-color: rgb(255, 107, 16);
      color: white;
      font-family: 'Tajawal', 'Roboto', sans-serif;
      border-radius: 8px;
      padding: 8px 16px;
      margin: 0 5px;
      font-weight: 500;
      font-size: 0.9rem;
      text-transform: none;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s, box-shadow 0.3s;
    }
    .MuiButton-containedPrimary:hover {
      background-color: rgb(230, 90, 0);
      box-shadow: 0 5px 8px rgba(0, 0, 0, 0.3);
    }
    .MuiButton-outlinedSecondary {
      color: #888;
      border: 1px solid #ccc;
      background-color: white;
      font-family: 'Tajawal', 'Roboto', sans-serif;
      border-radius: 8px;
      padding: 8px 16px;
      margin: 0 5px;
      font-weight: 500;
      font-size: 0.9rem;
      text-transform: none;
      transition: background-color 0.3s;
    }
    .MuiButton-outlinedSecondary:hover {
      background-color: #f5f5f5;
    }
    .sweet-alert-title {
      font-family: 'Tajawal', 'Roboto', sans-serif;
      font-weight: 600;
    }
    .sweet-alert-content {
      font-family: 'Tajawal', 'Roboto', sans-serif;
    }
  `;
  document.head.appendChild(style);
};

// Initialize on import
configureSweetAlert();

// Utility function to show alerts
const Alerts = {
  success: (title, text = '', timer = 2000) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer,
      timerProgressBar: true,
      showConfirmButton: timer > 3000
    });
  },
  
  error: (title, text = '') => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      showConfirmButton: true
    });
  },
  
  warning: (title, text = '') => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showConfirmButton: true
    });
  },
  
  info: (title, text = '') => {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      showConfirmButton: true
    });
  },
  
  confirm: (title, text = '', confirmButtonText = 'موافق', denyButtonText = 'إلغاء') => {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText,
      denyButtonText
    });
  },
  
  prompt: (title, inputPlaceholder = '', inputValue = '') => {
    return Swal.fire({
      title,
      input: 'text',
      inputPlaceholder,
      inputValue,
      showCancelButton: true
    });
  },
  
  loading: (title = 'جاري التحميل...') => {
    Swal.fire({
      title,
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false
    });
  },
  
  close: () => {
    Swal.close();
  }
};

export default Alerts;