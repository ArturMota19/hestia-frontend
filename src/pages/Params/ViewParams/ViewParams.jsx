// Components
import Header from "../../../basics/Header/Header";
// Images
import peopleParam from "../../../assets/icons/params/people-param.svg";
import actuatorParam from "../../../assets/icons/params/actuator-param.svg";
import roomParam from "../../../assets/icons/params/room-param.svg";
import activityParam from "../../../assets/icons/params/activity-param.svg";
// Imports
import { Helmet } from "react-helmet";
//Styles
import s from "./ViewParams.module.scss";
import { useTranslation } from "react-i18next";
import ViewComponent from "../../../basics/ViewComponent/ViewComponent";
import { useState } from "react";
import Button from "../../../basics/Button/Button";

export default function ViewParams() {
	const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  let fakeData = [
    {
      paramName: "Pessoa Tal XYZ",
      actuatorSpec: [],
      capacity: null,
      type: "person"
    },
    {
      paramName: "Ar Condicionado",
      actuatorSpec: [{ sound: "34" }, { talParam: "OFF" }],
      capacity: null,
      type: "actuator"
    },
    {
      paramName: "Rom tal tal",
      actuatorSpec: [],
      capacity: 3,
      type: "room"
    },
    {
      paramName: "Atividade Tal",
      actuatorSpec: [],
      capacity: null,
      type: "activity"
    },
    {
      paramName: "Pessoa João Silva",
      actuatorSpec: [],
      capacity: null,
      type: "person"
    },
    {
      paramName: "Lâmpada Inteligente",
      actuatorSpec: [{ brightness: "70%" }, { status: "ON" }],
      capacity: null,
      type: "actuator"
    },
    {
      paramName: "Sala de Estar",
      actuatorSpec: [],
      capacity: 5,
      type: "room"
    },
    {
      paramName: "Reunião de Equipe",
      actuatorSpec: [],
      capacity: null,
      type: "activity"
    },
    {
      paramName: "Pessoa Maria Oliveira",
      actuatorSpec: [],
      capacity: null,
      type: "person"
    },
    {
      paramName: "Ventilador",
      actuatorSpec: [{ speed: "3" }, { status: "ON" }],
      capacity: null,
      type: "actuator"
    },
    {
      paramName: "Cozinha",
      actuatorSpec: [],
      capacity: 2,
      type: "room"
    },
    {
      paramName: "Treinamento de Segurança",
      actuatorSpec: [],
      capacity: null,
      type: "activity"
    },
    {
      paramName: "Pessoa Carlos Pereira",
      actuatorSpec: [],
      capacity: null,
      type: "person"
    },
    {
      paramName: "Aquecedor",
      actuatorSpec: [{ temperature: "22°C" }, { status: "ON" }],
      capacity: null,
      type: "actuator"
    },
    {
      paramName: "Quarto Principal",
      actuatorSpec: [],
      capacity: 4,
      type: "room"
    },
    {
      paramName: "Sessão de Yoga",
      actuatorSpec: [],
      capacity: null,
      type: "activity"
    }
  ];

  const totalPages = Math.ceil(fakeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = fakeData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

	return (
		<main className={s.wrapperViewParams}>
			<Helmet>
				<meta charSet="utf-8" />
				<title>HESTIA | View Preset</title>
			</Helmet>
			<Header />
			<section className={s.hestiaInfoWrapper}>
				<h1>{t("viewHousePreset")}</h1>
				<section className={s.gridWrapper}>
					{currentItems.length > 0 ? (
						currentItems.map((item, index) => (
							<ViewComponent
								index={index}
								title={item.paramName}
                actuatorSpec={item.actuatorSpec}
                capacity={item.capacity}
								type={item.type}
								hasActions={true}
                image={item.type === "person" ? peopleParam : item.type === "actuator" ? actuatorParam : item.type === "room" ? roomParam : activityParam}
							/>
						))
					) : (
						<div>
							<h4>{t("noHousePreset")}</h4>
						</div>
					)}
				</section>
        {/* TODO: Transform this in a component */}
        <div className={s.pagination}>
          <Button 
            text={t('prev')} 
            backgroundColor={currentPage === 1 ? "secondary" : "primary"} 
            height={36}
            disabled={currentPage === 1}
            doFunction={handlePrev}/>
          <span>
            {currentPage} de {totalPages}
          </span>
          <Button 
            text={t('next')} 
            backgroundColor={currentPage === totalPages ? "secondary" : "primary"} 
            height={36}
            disabled={currentPage === totalPages}
            doFunction={handleNext}/>
        </div>
			</section>
		</main>
	);
}
