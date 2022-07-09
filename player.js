let url;

const getValuesFromInputs = () =>{
    const profileAud = document.querySelector('input.profile-aud').files[0];
    document.querySelector('form').style.display = 'none';
    return [profileAud];
 }

 const convertInputValues = () => {
    const [profileAud] = getValuesFromInputs();
    const profileAudURL = URL.createObjectURL(profileAud);
    return[profileAudURL]
  }

  const addInputToProfile = () => {
    const [profileAudURL]  = convertInputValues();
    document.querySelector('.aud').setAttribute('src', profileAudURL);
    url = profileAudURL;
    started = true;
    sound.play();
  }

document.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();
    addInputToProfile();
  });