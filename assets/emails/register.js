const registerMailTemplate = async (user) => {
  return `
    <p>Hallo ${user},</p>
    <p>Wat leuk dat je een account hebt aangemaakt bij Digikast.
    Vanaf nu wordt het organiseren van je kleding een stuk gemakkelijker!</p>

    <p>Ga snel aan de slag met het digitaliseren van je eigen kast.
    Weten hoe Digikast precies werkt? Open dan het linkje voor een
    uitgebreide handleiding. Hierin vind je onder andere hoe je
    kasten/koffers, kledingstukken en outfits moet toevoegen. (link naar de site met de uitleg en filmpje)</p>

    <p>Nogmaals zijn wij blij je te verwelkomen bij Digikast, als er vragen
    zijn dan staan wij voor je klaar via info@digikast.nl!</p>


    <p>Met vriendelijke kledinggroet,<br>
    Team Digikast</p>
    <img src="cid:logo" width="40" height="40"/>
  `;
};

module.exports = {
  registerMailTemplate,
};
