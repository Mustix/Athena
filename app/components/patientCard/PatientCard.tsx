import styles from "./PatientCard.module.css";
import REQUIRED_FIELDS from "./constants";

const PatientCard = ({ data }: Record<string, string>) => {
  // Helper function to check if a field is empty
  const isFieldEmpty = (value: string | undefined): boolean => {
    return value === undefined || value === null || value === "";
  };

  // Get list of missing fields
  const missingFields = REQUIRED_FIELDS.filter(({ field }) => {
    if (data) {
      return isFieldEmpty(data[field.toLowerCase()]);
    }
  });
  return (
    <>
      <div className={styles.patientCard}>
        <h3>Patient Card</h3>
        <div className={styles.box}>
          <ul className={styles.list}>
            {REQUIRED_FIELDS.map(({ field, name }) => {
              const value = data[field.toLowerCase()];
              const isEmpty = isFieldEmpty(value);

              return (
                <li
                  key={field}
                  className={
                    field.toLowerCase() === "patientid" ? styles.top : ""
                  }
                >
                  <span>{name}:</span>
                  {isEmpty ? (
                    <span className={styles.emptyField}>
                      <span className={styles.warningIcon} />
                      Required
                    </span>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PatientCard;
/* 
const requiredSection = () => {
    const items: { name: string; value: string }[] = REQUIRED_FIELDS.map(
      ({ field, name }) => {
        if (data[0][field.toLowerCase()]) {
          return { value: data[0][field.toLowerCase()], name };
        }
        return { name, value: "" };
      }
    );

    return items.map((item) => (
      <div key={item.name}>
        {item.name} --- {item.value}
      </div>
    ));
  };

 */
