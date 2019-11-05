import _ from "lodash";

export function Updatedata(
  data,
  Country,
  Year,
  Month,
  Day,
  AttackType,
  Casualities
) {
  data = data.filter(
    d =>
      Country.includes(_.get(d, "Country")) &&
      Year.includes(_.get(d, "Year")) &&
      Month.includes(_.get(d, "Month")) &&
      Day.includes(_.get(d, "Day")) &&
      AttackType.includes(_.get(d, "AttackType")) &&
      Casualities.includes(_.get(d, "casualities"))
  );
  return data;
}
