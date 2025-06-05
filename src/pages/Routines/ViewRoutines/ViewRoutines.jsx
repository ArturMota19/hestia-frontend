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
import { useEffect } from "react";
import { BaseRequest } from "../../../services/BaseRequest";

export default function ViewRoutines() {
		const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [housePresets, setHousePresets] = useState([])
  const [itemsCount, setItemsCount] = useState(1)
  const itemsPerPage = 6;

  async function FetchData(){
    const response = await BaseRequest({
      method: "GET",
      url: `routines/getAllPeopleRoutines/${currentPage}`,
      isAuth: true,
      setIsLoading
    })
    if (response.status === 200) {
      setItemsCount(response.data.count);
      setHousePresets(response.data.peopleRoutines);
      console.log(response.data.peopleRoutines)
    }
  }

  useEffect(() => {
    FetchData()
  },[])

  const totalPages = Math.ceil(itemsCount / itemsPerPage);

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
					{housePresets.length > 0 ? (
						housePresets.map((item, index) => (
							<ViewComponent
								index={index}
								title={item.housePreset}
								people={[item.peopleName]}
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
