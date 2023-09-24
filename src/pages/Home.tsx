import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import data from "../WineData.json";

//the structure of a single item in the WineData JSON
interface WineDataItem {
  Alcohol: number;
  "Malic Acid": number;
  Ash: any;
  "Alcalinity of ash": number;
  Magnesium:any;
  "Total phenols": number;
  Flavanoids:any;
  "Nonflavanoid phenols": any;
  Proanthocyanins: string;
  "Color intensity": any;
  Hue: any;
  "OD280/OD315 of diluted wines": number|string;
  Unknown: number;
}

function Home() {
  //State to store table data, class data, and flag to check if class data is ready
  const [tableData, setTableData] = useState<Record<string, any>>({});
  const [classData, setClassData] = useState<Record<string, WineDataItem[]>>(
    {}
  );
  const [isClassData, setIsClassData] = useState(false);

  // Custom function to calculate median of an array of numbers
  function median(arr: number[]): number {
    const mid = Math.floor(arr.length / 2);
    const sortedArr = arr.sort((a, b) => a - b);
    if (arr.length % 2 === 0) {
      return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    } else {
      return sortedArr[mid];
    }
  }

  // Custom function to calculate mode of an array of numbers
  function mode(arr: number[]): number {
    const mode: Record<number, number> = {};
    let max = 0,
      count = 0;
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (mode[item]) mode[item]++;
      else mode[item] = 1;
      if (count < mode[item]) {
        max = item;
        count = mode[item];
      }
    }
    return max;
  }
  
  // Custom function to calculate mean (average) of an array of numbers
  function mean(arr: number[]): number {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      total += arr[i];
    }
    return total / arr.length;
  }

  // Custom function to calculate to transform the given data into classified class data
  const normalise = useCallback(async () => {
    // Create a copy of the classData state
    let prevData = { ...classData };

    // Iterate through the WineData JSON and organize it by alcohol class
    await Promise.all(
      data.map(async (winedata: WineDataItem, index: any) => {
        if (!prevData[String(winedata.Alcohol - 1)]) {
           // Create a new entry if it doesn't exist
          prevData[String(winedata.Alcohol - 1)] = [winedata];
        } else {
           // Add to an existing entry if it exists
          prevData[String(winedata.Alcohol - 1)].push(winedata);
        }
        if (index === data.length - 1) {
          // If the last item is processed, update the state
          return winedata;
        }
      })
    ).then((res) => {
       // Set the updated classData state and indicate that class data is ready
      setClassData(prevData);
      setIsClassData(true);
    });
  }, [classData]);

  const calculate = useCallback(async () => {
    // Create a copy of the tableData state
    let newTableData: Record<string, any> = { ...tableData };

    // Iterate through keys in classData
    Object.keys(classData).forEach(async (key) => {
       // Process each object in classData for the current key
      await Promise.all(
        classData[key].map((eachObject) => {
          // Convert certain properties from strings to numbers if needed
          if (typeof eachObject.Ash === "string")
            eachObject.Ash = parseFloat(eachObject.Ash);
          if (typeof eachObject.Hue === "string")
            eachObject.Hue = parseFloat(eachObject.Hue);
          if (typeof eachObject.Magnesium === "string")
            eachObject.Magnesium = parseFloat(eachObject.Magnesium);
          if (typeof eachObject.Flavanoids === "string")
            eachObject.Flavanoids = parseFloat(eachObject.Flavanoids);
          if (!newTableData[key]) newTableData[key] = {};
          return eachObject;
        })
      );

          // Calculate and store flavanoidValues and gammaValues
      newTableData[key]["flavanoidsValues"] = classData[key].map(
        (eachObject) => eachObject.Flavanoids
      );
      newTableData[key]["gammaValues"] = classData[key].map(
        (eachObject) => (eachObject.Ash * eachObject.Hue) / eachObject.Magnesium
      );

       // Calculate and store means, medians, and modes
      newTableData[key]["flavanoidsMean"] = mean(
        newTableData[key]["flavanoidsValues"]
      ).toFixed(3);
      newTableData[key]["gammaMean"] = mean(
        newTableData[key]["gammaValues"]
      ).toFixed(3);
      newTableData[key]["flavanoidsMedian"] = median(
        newTableData[key]["flavanoidsValues"]
      ).toFixed(3);
      newTableData[key]["gammaMedian"] = median(
        newTableData[key]["gammaValues"]
      ).toFixed(3);
      newTableData[key]["flavanoidsMode"] = mode(
        newTableData[key]["flavanoidsValues"]
      ).toFixed(3);
      newTableData[key]["gammaMode"] = mode(
        newTableData[key]["gammaValues"]
      ).toFixed(3);
    });

    // Update the tableData state with the calculated values
    setTableData(newTableData);
    return;
  }, [classData, tableData]);

  useEffect(() => {
    // If class data is available, calculate the table data
    if (isClassData) calculate();

     // If class data is not available, normalize the dat
    if (!isClassData) normalise();
  }, [isClassData, normalise, calculate]);

  return (
    <div className="table-responsive" style={{ width: "80%" }}>
      <h1>Wine data</h1>
      {Object.keys(tableData).length > 0 ? (
        <Table tableData={tableData} />
      ) : (
        <h2>Loading</h2>
      )}
    </div>
  );
}

export default Home;
