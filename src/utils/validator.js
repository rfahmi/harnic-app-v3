export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email tidak boleh kosong.';
  if (!re.test(email)) return 'Ooops! Email tidak valid.';

  return '';
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) return 'Password tidak boleh kosong.';

  return '';
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0) return 'Nama tidak boleh kosong.';

  return '';
};
export const phoneValidator = (phone) => {
  if (!phone || phone.length <= 0) return 'Nomor HP tidak boleh kosong.';

  return '';
};
