// Components
import Header from "../../../basics/Header/Header";
// Images
import peopleParam from "../../../assets/icons/params/people-param.svg";
import actuatorParam from "../../../assets/icons/params/actuator-param.svg";
import roomParam from "../../../assets/icons/params/room-param.svg";
import activityParam from "../../../assets/icons/params/activity-param.svg";
// Imports
import { Helmet } from "react-helmet";
import {BaseRequest} from "../../../services/BaseRequest"
//Styles
import s from "./ViewParams.module.scss";
import { useTranslation } from "react-i18next";
import ViewComponent from "../../../basics/ViewComponent/ViewComponent";
import { useEffect, useState } from "react";
import Button from "../../../basics/Button/Button";
import { PuffLoader } from "react-spinners";

export default function ViewParams() {
	const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [paramType, setParamType] = useState("people") // people, activity, room
  const [data, setData] = useState([])
  const [itemsCount, setItemsCount] = useState(1)
  const itemsPerPage = 6;
  const [isLoading, setIsLoading] = useState(false)

  async function FetchData(){
    const response = await BaseRequest({
      method: "GET",
      url: `/${paramType}/getAll/${currentPage}`,
      isAuth: true,
      setIsLoading
    })
    setData(response.data[paramType])
    setItemsCount(response.data.count)
  }
  useEffect(() => {
    FetchData()
  },[currentPage, paramType])

  const totalPages = Math.ceil(itemsCount / itemsPerPage);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

	return (
		<main className={s.wrapperViewParams}>
			<Helmet>
				<meta charSet="utf-8" />
				<title>HESTIA | View Params</title>
			</Helmet>
			<Header />
			<section className={s.hestiaInfoWrapper}>
				<h1>{t("viewHouseParams")}</h1>
        <section className={s.wrapperButtons}>
          <Button 
          text={t('people')} 
          backgroundColor={paramType == "people" ? "primary" : "secondary"} 
          height={36}
          doFunction={() => {setParamType("people");setCurrentPage(1)}}/>
          <Button 
          text={t('activities')} 
          backgroundColor={paramType == "activities" ? "primary" : "secondary"} 
          height={36}
          doFunction={() => {setParamType("activities");setCurrentPage(1)}}/>
          <Button 
          text={t('rooms')} 
          backgroundColor={paramType == "rooms" ? "primary" : "secondary"} 
          height={36}
          doFunction={() => {setParamType("rooms");setCurrentPage(1)}}/>
          <Button 
          text={t('actuators')} 
          backgroundColor={paramType == "actuators" ? "primary" : "secondary"} 
          height={36}
          doFunction={() => {setParamType("actuators");setCurrentPage(1)}}/>
        </section>
				<section className={s.gridWrapper}>
					{data.length > 0 && !isLoading &&
						data.map((item, index) => (
							<ViewComponent
								index={index}
								title={item.paramName}
                actuatorSpec={item.actuatorSpec}
                capacity={item.capacity}
								type={item.type}
								hasActions={item.type == "actuators"}
                image={item.type === "person" ? peopleParam : item.type === "actuator" ? actuatorParam : item.type === "room" ? roomParam : activityParam}
							/>
						))
					}
				</section>
        {data.length <= 0 && !isLoading &&
          <div className={s.noParamsDiv}>
            <h4>{t("noParams")} {t(paramType)}</h4>
            <a href="/create-params">{t('createParams')}</a>
          </div>
        }
        {data.length <= 0 && isLoading &&
          <div className={s.loadingWrapper}>
            <PuffLoader
              size={100}
              color={'var(--primary-color)'}
              speedMultiplier={1}
            />
          </div>
        }
        {/* TODO: Transform this in a component */}
        {data.length > 0 &&
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
        }
			</section>
		</main>
	);
}
