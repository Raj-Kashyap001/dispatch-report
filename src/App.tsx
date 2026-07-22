const App = () => {
  const data = [
    {
      mines: "Batura to Prakash Plant champa",
      dispatchVehicles: 3,
      reachedInPlant: 9,
      balanceToVehicle: 4,
      routeDeviations: 2,
      haltsInGreyArea: 0,
      powerCuts: 0,
      oldVehicle: 1,
    },
    {
      mines: "Bhaskar Para to Prakash Plant champa",
      dispatchVehicles: 49,
      reachedInPlant: 46,
      balanceToVehicle: 54,
      routeDeviations: 6,
      haltsInGreyArea: 0,
      powerCuts: 31,
      oldVehicle: 12,
    },
    {
      mines: "Gevra Area Central Store to Prakash Industries",
      dispatchVehicles: 6,
      reachedInPlant: 4,
      balanceToVehicle: 5,
      routeDeviations: 0,
      haltsInGreyArea: 0,
      powerCuts: 0,
      oldVehicle: 0,
    },
    {
      mines: "Kushmunda coal mine to Prakash Plant champa",
      dispatchVehicles: 26,
      reachedInPlant: 17,
      balanceToVehicle: 20,
      routeDeviations: 2,
      haltsInGreyArea: 0,
      powerCuts: 0,
      oldVehicle: 0,
    },
    {
      mines: "Manikpur ocp to Prakash Plant champa",
      dispatchVehicles: 19,
      reachedInPlant: 21,
      balanceToVehicle: 9,
      routeDeviations: 0,
      haltsInGreyArea: 0,
      powerCuts: 0,
      oldVehicle: 0,
    },
  ];

  const total = data.reduce(
    (acc, item) => ({
      dispatchVehicles: acc.dispatchVehicles + item.dispatchVehicles,
      reachedInPlant: acc.reachedInPlant + item.reachedInPlant,
      balanceToVehicle: acc.balanceToVehicle + item.balanceToVehicle,
      routeDeviations: acc.routeDeviations + item.routeDeviations,
      haltsInGreyArea: acc.haltsInGreyArea + item.haltsInGreyArea,
      powerCuts: acc.powerCuts + item.powerCuts,
      oldVehicle: acc.oldVehicle + item.oldVehicle,
    }),
    {
      dispatchVehicles: 0,
      reachedInPlant: 0,
      balanceToVehicle: 0,
      routeDeviations: 0,
      haltsInGreyArea: 0,
      powerCuts: 0,
      oldVehicle: 0,
    },
  );

  return (
    <div className="App">
      <h1>Report Maker</h1>

      <div id="input-card">
        <div>
          <label htmlFor="job-report">Select Job Order Report File</label>
          <br />
          <input type="file" id="job-report" />
        </div>

        <br />

        <div>
          <label htmlFor="alert-report">Select Alerts Report File</label>
          <br />
          <input type="file" id="alert-report" />
        </div>
      </div>

      <div id="output-card">
        <h2>Dispatch Report</h2>
        <h3>PIL (SHIFT B) 21-07-2026</h3>

        <table>
          <thead>
            <tr>
              <th>MINES</th>
              <th>DISPATCH</th>
              <th>REACHED IN PLANT</th>
              <th>BALANCE TO VEHICLE</th>
              <th>ROUTE DEVIATIONS</th>
              <th>HALTS IN GREY AREA</th>
              <th>POWER CUTS</th>
              <th>OLD VEHICLES</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.mines}</td>
                <td>{item.dispatchVehicles}</td>
                <td>{item.reachedInPlant}</td>
                <td>{item.balanceToVehicle}</td>
                <td>{item.routeDeviations}</td>
                <td>{item.haltsInGreyArea}</td>
                <td>{item.powerCuts}</td>
                <td>{item.oldVehicle}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>TOTAL</th>
              <th>{total.dispatchVehicles}</th>
              <th>{total.reachedInPlant}</th>
              <th>{total.balanceToVehicle}</th>
              <th>{total.routeDeviations}</th>
              <th>{total.haltsInGreyArea}</th>
              <th>{total.powerCuts}</th>
              <th>{total.oldVehicle}</th>
            </tr>
          </tfoot>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <button onClick={() => alert("Copy coming soon")}>Copy</button>

          <button onClick={() => alert("Download coming soon")}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
