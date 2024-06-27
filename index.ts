interface IVpois {
  _id: string;
  url: string;
  name: string;
  status: string;
  isAvailable: boolean;
}

(async () => {
  console.log("The script works");
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
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
`;
  const IsNOTAvailable: string = `<span style="color:red">x</span>`;
  const IsAvailable: string = `<span style="color:green">✓</span>`;
  const returnTable = (name:string,availability: boolean, url: string): string => {
    return `
    <div style="display:flex;flex-direction:row; width:100%; flex-wrap: nowrap;justify-content: space-between; padding:4px; margin:4px; border-bottom:2px solid black;">

       <div>${availability ? IsAvailable: IsNOTAvailable} ${name}</div>
      <div><a target="_blank" href="${url}">SPC/PIL</a></div>
  </div>
    `;
  };
  const renderVpois = (vpois: IVpois[]): void => {
    vpois.forEach((vpoi: IVpois) => {
      const vpoiDiv: HTMLDivElement = document.createElement("div");

      vpoiDiv.innerHTML = `
      <div style="margin:1px; padding:4px">
       ${returnTable(vpoi.name,vpoi.isAvailable, vpoi.url)}`;            
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
          <p><a href="https://prehledy.sukl.cz/prehled_leciv.html#/" target="_blank">Přejít na SÚKL pro vyhledávání VPOIS</a></p>
      `;
      VPOISUI.appendChild(errorDiv);
    }
  };

  init();
})();
