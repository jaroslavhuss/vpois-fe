interface IVpois {
  _id: string;
  url: string;
  name: string;
  status: string;
  isAvailable: boolean;
}

(async () => {
  console.log("The script works")
  const loadVpois = async (): Promise<IVpois[] | null> => {
    try {
      const res: Response = await fetch(
        "https://central.gswps.eu:10443/centralapp/spc/get/all"
      );
      const vpois: IVpois[] = await res.json();
      return vpois;
    } catch (error) {
      return null;
    }
  };
  const VPOISUI: HTMLDivElement = document.createElement("div");
  VPOISUI.style.cssText = `
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
`;
  const IsNOTAvailable: string = `<span style="color:red">x</span>`;
  const IsAvailable: string = `<span style="color:green">✓</span>`;
  const renderVpois = (vpois: IVpois[]): void => {
    vpois.forEach((vpoi: IVpois) => {
      const vpoiDiv: HTMLDivElement = document.createElement("div");

      vpoiDiv.innerHTML = `
      <div style="border:1px solid black; margin:1px; padding:4px">
              <h3>${vpoi.isAvailable ? IsAvailable : IsNOTAvailable} ${
        vpoi.name
      }</h3>
              <p>${vpoi.status}</p>
              <p>${
                vpoi.isAvailable
                  ? "Přípravek dodáván na trh v České republice"
                  : "Přípravek není dodáván na trh v České republice"
              }</p>
              <a href=${vpoi.url} target="_blank">SPC/PIL ke stažení na SÚKL</a>
              <div>
          `;
      VPOISUI.appendChild(vpoiDiv);
    });
  };

  const init = async (): Promise<void> => {
    const vpois: IVpois[] | null = await loadVpois();

    if (vpois) {
      renderVpois(vpois);
      const vpoisdynamic: HTMLElement | null =
        document.getElementById("vpois-dynamic");
      vpoisdynamic.appendChild(VPOISUI);
    } else {
      const errorDiv: HTMLDivElement = document.createElement("div");
      errorDiv.innerHTML = `
          <h3>Produkty VPOIS nemohly být bezpečně načteny. Zkontrolujte, že nejste schovaní za blokovanou IP adresou.</h3>
      `;
      VPOISUI.appendChild(errorDiv);
    }
  };

  init();
})();
