// Components
import Header from "../../basics/Header/Header";
// Images
// Imports
import { Accordion, AccordionTab } from "primereact/accordion";
import { useTranslation } from "react-i18next";
//Styles
import s from "./HowToUse.module.scss";
import { Helmet } from "react-helmet";

export default function HowToUse() {
  const { t } = useTranslation();

  return (
    <main className={s.wrapperFinalFile}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HESTIA | How To Use</title>
      </Helmet>
      <Header />
      <section className={s.hestiaInfoWrapper}>
        <h1>{t("howToUse")}</h1>
        <div className={s.wrapperInternForm}>
          <Accordion>
            <AccordionTab header={t("howToUsePurpose")}>
              <p className="m-0">
                {t("howToUsePurposeDesc")}
              </p>
            </AccordionTab>
            <AccordionTab header={t("howToUseHowWorks")}>
              <p className="m-0">
                {t("howToUseHowWorksDesc")}
              </p>
            </AccordionTab>
            <AccordionTab header={t("howToUseParamsPresets")}>
              <Accordion>
                <AccordionTab header={t("howToUseParams")}>
                  <p>
                    {t("howToUseParamsDesc")}
                  </p>
                  <ul>
                    <li>
                      <strong>{t("howToUseParamsPeople").split(":")[0]}:</strong> {t("howToUseParamsPeople").split(":")[1]}
                    </li>
                    <li>
                      <strong>{t("howToUseParamsActivities").split(":")[0]}:</strong> {t("howToUseParamsActivities").split(":")[1]}
                    </li>
                    <li>
                      <strong>{t("howToUseParamsRooms").split(":")[0]}:</strong> {t("howToUseParamsRooms").split(":")[1]}
                    </li>
                    <li>
                      <strong>{t("howToUseParamsActuators").split(":")[0]}:</strong> {t("howToUseParamsActuators").split(":")[1]}
                    </li>
                    <li>
                      <strong>{t("howToUseParamsActivityPreset").split(":")[0]}:</strong> {t("howToUseParamsActivityPreset").split(":")[1]}
                    </li>
                  </ul>
                </AccordionTab>
                <AccordionTab header={t("howToUsePresets")}>
                  <p className="m-0">
                    {t("howToUsePresetsDesc")}
                  </p>
                </AccordionTab>
              </Accordion>
            </AccordionTab>
            <AccordionTab header={t("howToUseStepByStep")}>
              <Accordion>
                <AccordionTab header={t("howToUseStep1")}>
                  <p className="m-0">
                    {t("howToUseStep1Desc")}
                  </p>
                </AccordionTab>
                <AccordionTab header={t("howToUseStep2")}>
                  <p className="m-0">
                    {t("howToUseStep2Desc")}
                  </p>
                </AccordionTab>
                <AccordionTab header={t("howToUseStep3")}>
                  <p className="m-0">
                    {t("howToUseStep3Desc")}
                  </p>
                </AccordionTab>
                <AccordionTab header={t("howToUseStep4")}>
                  <p className="m-0">
                    {t("howToUseStep4Desc")}
                  </p>
                </AccordionTab>
                <AccordionTab header={t("howToUseStep5")}>
                  <p className="m-0">
                    {t("howToUseStep5Desc")}
                  </p>
                </AccordionTab>
                <AccordionTab header={t("howToUseStep6")}>
                  <p className="m-0">
                    {t("howToUseStep6Desc")}
                  </p>
                </AccordionTab>
                <AccordionTab header={t("howToUseStep7")}>
                  <p className="m-0">
                    {t("howToUseStep7Desc")}
                  </p>
                </AccordionTab>
              </Accordion>
            </AccordionTab>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
