let url = "";
let urlLoaded = false;

const getValuesFromInputs = () => {
  const profileAud = document.querySelector('input.profile-aud').files[0];
  document.querySelector('.upload').style.background = '#8c8c8c';
  return [profileAud];
}

const convertInputValues = () => {
  const [profileAud] = getValuesFromInputs();
  const profileAudURL = URL.createObjectURL(profileAud);
  return [profileAudURL]
}

const addInputToProfile = () => {
  const [profileAudURL] = convertInputValues();
  document.querySelector('.aud').setAttribute('src', profileAudURL);
  url = profileAudURL;
  urlLoaded = true;
  //sound.play();
}

document.querySelector('.upload').addEventListener('click', (e) => {
  e.preventDefault();
    addInputToProfile();
});

function enabledbtn(){
  document.querySelector('.upload').disabled = false;
}

