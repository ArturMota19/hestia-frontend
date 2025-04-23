// Components
import Header from "../../../basics/Header/Header";
// Images
import houseIcon from "../../../assets/icons/house-icon.svg";
// Imports
import { Helmet } from "react-helmet";
//Styles
import s from "./ViewPreset.module.scss";
import { useTranslation } from "react-i18next";
import ViewComponent from "../../../basics/ViewComponent/ViewComponent";
import { useState } from "react";
import Button from "../../../basics/Button/Button";

export default function ViewPreset() {
	const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  let fakeData = [
    {
      paramName: "Casa Moderna",
      actuatorSpec: ["Luzes", "Câmeras", "Sensores de Movimento"],
      capacity: 5,
      type: "preset",
      rooms: ["Cozinha", "Sala de Estar", "Quarto Principal", "Banheiro", "Garagem"],
    },
    {
      paramName: "Apartamento Compacto",
      actuatorSpec: ["Ar Condicionado", "Fechadura Inteligente"],
      capacity: 3,
      type: "preset",
      rooms: ["Sala", "Quarto", "Banheiro"],
    },
    {
      paramName: "Escritório Executivo",
      actuatorSpec: ["Projetor", "Luzes Automáticas", "Câmeras de Segurança"],
      capacity: 10,
      type: "preset",
      rooms: ["Sala de Reunião", "Escritório", "Copa", "Banheiro"],
    },
    {
      paramName: "Casa de Campo",
      actuatorSpec: ["Aquecedor", "Sistema de Irrigação"],
      capacity: 7,
      type: "preset",
      rooms: ["Sala", "Cozinha", "Quarto", "Banheiro", "Jardim"],
    },
    {
      paramName: "Loja de Roupas",
      actuatorSpec: ["Câmeras", "Sensores de Presença"],
      capacity: 15,
      type: "preset",
      rooms: ["Área de Vendas", "Estoque", "Banheiro"],
    },
    {
      paramName: "Apartamento Luxo",
      actuatorSpec: ["Luzes Inteligentes", "Cortinas Automáticas"],
      capacity: 4,
      type: "preset",
      rooms: ["Sala de Estar", "Quarto", "Banheiro", "Varanda"],
    },
    {
      paramName: "Casa Familiar",
      actuatorSpec: ["Sistema de Som", "Luzes", "Câmeras"],
      capacity: 6,
      type: "preset",
      rooms: ["Sala", "Cozinha", "Quarto", "Banheiro", "Quintal"],
    },
    {
      paramName: "Consultório Médico",
      actuatorSpec: ["Ar Condicionado", "Luzes Automáticas"],
      capacity: 8,
      type: "preset",
      rooms: ["Recepção", "Consultório", "Banheiro"],
    },
  ];

  const totalPages = Math.ceil(fakeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = fakeData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

	return (
		<main className={s.wrapperViewPreset}>
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
								room={item.rooms}
								type={"preset"}
								hasActions={true}
                image={houseIcon}
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
