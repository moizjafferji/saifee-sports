let userSession = {};

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const id_token = googleUser.getAuthResponse().id_token;

  userSession = {
    id_token,
    email: profile.getEmail(),
    name: profile.getName(),
    imageUrl: profile.getImageUrl(),
  };

  // Show animation screen
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("animation-screen").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("animation-screen").classList.add("hidden");
    document.getElementById("home-screen").classList.remove("hidden");
    loadHomePage();
  }, 3000);
}
