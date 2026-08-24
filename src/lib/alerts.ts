import Swal from 'sweetalert2';

// Base dark theme configuration matching Bissap Games design system
const customSwal = Swal.mixin({
  background: '#0D0D18',
  color: '#FFFFFF',
  confirmButtonColor: '#FF1E56',
  denyButtonColor: '#2A2D3D',
  cancelButtonColor: '#1F2231',
  customClass: {
    popup: 'glass-panel-elevated border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl',
    title: 'text-xl font-extrabold text-white tracking-tight',
    htmlContainer: 'text-sm text-gray-300 font-medium',
    confirmButton: 'px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FF1E56] to-[#9E002B] text-white shadow-lg shadow-[#FF1E56]/30 hover:opacity-90 transition-all border-0',
    cancelButton: 'px-5 py-2.5 rounded-xl font-bold bg-white/10 text-gray-300 hover:bg-white/20 transition-all border border-white/10',
    timerProgressBar: 'bg-[#FF1E56]',
  },
});

/**
 * Show 3-second loading animation timer popup that auto-disappears after completion
 */
export const showLoadingAlert = (title: string = 'Processing Request...', text: string = 'Please wait while we sync with the database.') => {
  return customSwal.fire({
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/**
 * Show Success Alert with 3-second timer
 */
export const showSuccessAlert = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'success',
    iconColor: '#10B981',
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

/**
 * Show Error Alert with 3-second timer
 */
export const showErrorAlert = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'error',
    iconColor: '#FF1E56',
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

/**
 * Show Confirmation Modal for dangerous actions (e.g. Delete)
 */
export const showConfirmAlert = async (title: string, text: string, confirmText: string = 'Yes, Proceed') => {
  const result = await customSwal.fire({
    icon: 'warning',
    iconColor: '#F59E0B',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export default customSwal;
