// Components
import Header from "../../../basics/Header/Header";
// Images
import houseIcon from "../../../assets/icons/routines-icon.svg";
// Imports
import { Helmet } from "react-helmet";
//Styles
import s from "./ViewRoutines.module.scss";
import { useTranslation } from "react-i18next";
import ViewComponent from "../../../basics/ViewComponent/ViewComponent";
import { useState } from "react";
import Button from "../../../basics/Button/Button";

export default function ViewRoutines() {
	const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  let fakeData = [
    {
      paramName: "Preset 01",
      people: ["Artur", "Fernando"],
    },
    {
      paramName: "Preset 02",
      people: ["Maria", "João"],
    },
    {
      paramName: "Preset 03",
      people: ["Carlos", "Ana"],
    },
    {
      paramName: "Preset 04",
      people: ["Pedro", "Clara"],
    },
    {
      paramName: "Preset 05",
      people: ["Lucas", "Sofia"],
    },
    {
      paramName: "Preset 06",
      people: ["Gabriel", "Beatriz"],
    },
    {
      paramName: "Preset 07",
      people: ["Rafael", "Isabela"],
    },
    {
      paramName: "Preset 08",
      people: ["Thiago", "Camila"],
    },
  ];

  const totalPages = Math.ceil(fakeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = fakeData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

	return (
		<main className={s.wrapperViewRoutines}>
			<Helmet>
				<meta charSet="utf-8" />
				<title>HESTIA | View Preset</title>
			</Helmet>
			<Header />
			<section className={s.hestiaInfoWrapper}>
				<h1>{t("viewRoutines")}</h1>
				<section className={s.gridWrapper}>
					{currentItems.length > 0 ? (
						currentItems.map((item, index) => (
							<ViewComponent
								index={index}
								title={item.paramName}
								people={item.people}
								type={"routine"}
								hasActions={true}
                image={houseIcon}
							/>
						))
					) : (
						<div>
							<h4>{t("noRoutines")}</h4>
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
