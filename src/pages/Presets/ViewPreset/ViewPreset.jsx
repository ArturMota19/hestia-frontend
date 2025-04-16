// Components
import Header from "../../../basics/Header/Header";
// Images
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
      houseNome: "Preset Casa 1",
      rooms: ["Cozinha", "Sala", "Quarto", "Banheiro", "Varanda"],
    },
    {
      houseNome: "Preset Casa 2",
      rooms: ["Cozinha", "Sala de Jantar", "Quarto", "Escritório", "Garagem"],
    },
    {
      houseNome: "Preset Casa 3",
      rooms: ["Sala", "Quarto", "Banheiro", "Lavanderia", "Jardim"],
    },
    {
      houseNome: "Preset Casa 4",
      rooms: ["Cozinha", "Sala", "Quarto", "Banheiro", "Closet"],
    },
    {
      houseNome: "Preset Casa 5",
      rooms: ["Sala de Estar", "Sala de Jantar", "Quarto", "Banheiro", "Terraço"],
    },
    {
      houseNome: "Preset Casa 6",
      rooms: ["Cozinha", "Sala", "Quarto", "Banheiro", "Porão"],
    },
    {
      houseNome: "Preset Casa 7",
      rooms: ["Cozinha", "Sala", "Quarto", "Banheiro", "Área de Serviço"],
    },
    {
      houseNome: "Preset Casa 8",
      rooms: ["Sala", "Quarto", "Banheiro", "Escritório", "Piscina"],
    },
    {
      houseNome: "Preset Casa 9",
      rooms: ["Cozinha", "Sala", "Quarto", "Banheiro", "Quintal"],
    },
    {
      houseNome: "Preset Casa 10",
      rooms: ["Cozinha", "Sala de Estar", "Quarto", "Banheiro", "Sala de Jogos"],
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
								title={item.houseNome}
								text={item.rooms.join(", ")}
								type={"preset"}
								hasActions={true}
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
