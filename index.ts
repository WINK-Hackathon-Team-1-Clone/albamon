import dotenv from "dotenv";
import { init, conn } from "./database";
import {
  IAlbamonCollection,
  IAlbamonQueryDataBase,
  IAlbamonResponse,
} from "./interfaces";

const getBuildId = async (): Promise<string> => {
  const res = await fetch("https://albamon.com");
  const text = await res.text();
  const buildId = text.match(/"buildId": ?"([^"]+)"/)?.[1];
  if (!buildId) {
    throw new Error("Failed to get buildId");
  }
  return buildId;
};

const crawl = async (size: number = 10000) => {
  const buildId = await getBuildId();

  let totalCount = 0;
  for (let page = 0; totalCount >= page * size; page++) {
    console.log(page);
    let dataBase: IAlbamonQueryDataBase;

    try {
      const resp = await fetch(
        `https://www.albamon.com/_next/data/${buildId}/jobs/total.json?page=${page}&size=${size}`
      );
      const json: IAlbamonResponse = await resp.json();
      dataBase = json.pageProps.dehydratedState.queries[0]?.state.data.base;
      if (!dataBase) {
        throw new Error("Failed to get data");
      }
    } catch (err) {
      console.log(err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      page--;
      continue;
    }

    await putData(dataBase.normal.collection);

    totalCount = dataBase.pagination.totalCount;
  }
};

const putDataChunk = async (collections: IAlbamonCollection[]) => {
  const values: any[] = [];
  collections.forEach(
    ({
      recruitNo,
      recruitTitle,
      postStatusType,
      companyName,
      payType,
      pay,
      negoPay,
      workingTime,
      workingPeriod,
      negoWorkPeriod,
      workingWeek,
      workingDate,
      trainee,
      parts,
      closingDate,
      closingDateWithDDay,
      closingDDay,
      age,
      latitude,
      longitude,
      existsMap,
      workplaceAddress,
      workplaceArea,
    }) => {
      values.push(
        recruitNo,
        recruitTitle,
        postStatusType.description,
        companyName,
        payType.description,
        pay,
        negoPay,
        workingTime,
        workingPeriod,
        negoWorkPeriod,
        workingWeek,
        workingDate,
        trainee,
        parts.join(","),
        closingDate,
        closingDateWithDDay,
        closingDDay,
        age,
        latitude,
        longitude,
        existsMap,
        workplaceAddress,
        workplaceArea
      );
    }
  );
  const placeholders = Array(collections.length)
    .fill("(" + Array(23).fill("?").join(",") + ")")
    .join(",");

  await conn.query(
    `
    INSERT INTO albamon (
        id,
        title,
        status,
        company,
        payType,
        pay,
        negoPay,
        workingTime,
        workingPeriod,
        negoWorkPeriod,
        workingWeek,
        workingDate,
        trainee,
        parts,
        closingDate,
        closingDateWithDDay,
        closingDDay,
        age,
        latitude,
        longitude,
        existsMap,
        workplaceAddress,
        workplaceArea
    ) VALUES ${placeholders}
    ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        status = VALUES(status),
        company = VALUES(company),
        payType = VALUES(payType),
        pay = VALUES(pay),
        negoPay = VALUES(negoPay),
        workingTime = VALUES(workingTime),
        workingPeriod = VALUES(workingPeriod),
        negoWorkPeriod = VALUES(negoWorkPeriod),
        workingWeek = VALUES(workingWeek),
        workingDate = VALUES(workingDate),
        trainee = VALUES(trainee),
        parts = VALUES(parts),
        closingDate = VALUES(closingDate),
        closingDateWithDDay = VALUES(closingDateWithDDay),
        closingDDay = VALUES(closingDDay),
        age = VALUES(age),
        latitude = VALUES(latitude),
        longitude = VALUES(longitude),
        existsMap = VALUES(existsMap),
        workplaceAddress = VALUES(workplaceAddress),
        workplaceArea = VALUES(workplaceArea)
  `,
    values
  );
};

const putData = async (collections: IAlbamonCollection[]) => {
  for (let i = 0; i < collections.length / 1000; i++) {
    await putDataChunk(collections.slice(i * 1000, (i + 1) * 1000));
  }
};

const main = async () => {
  dotenv.config();
  await init();
  await crawl();
  console.log("done");
};

main();
