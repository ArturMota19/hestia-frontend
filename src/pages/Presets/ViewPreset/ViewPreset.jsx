// Components
import Header from "../../../basics/Header/Header";
// Images
import houseIcon from "../../../assets/icons/house-icon.svg";
// Imports
import { Helmet } from "react-helmet";
import { BaseRequest } from "../../../services/BaseRequest";
//Styles
import s from "./ViewPreset.module.scss";
import { useTranslation } from "react-i18next";
import ViewComponent from "../../../basics/ViewComponent/ViewComponent";
import { useEffect, useState } from "react";
import Button from "../../../basics/Button/Button";

export default function ViewPreset() {
	const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [housePresets, setHousePresets] = useState([])
  const [itemsCount, setItemsCount] = useState(1)
  const itemsPerPage = 6;

  async function FetchData(){
    const response = await BaseRequest({
      method: "GET",
      url: `presets/getAll/${currentPage}`,
      isAuth: true,
      setIsLoading
    })
    if (response.status === 200) {
      setItemsCount(response.data.count);
      const updatedPresets = response.data.presetData.map((preset) => {
      // Get each Room
      const rooms = [];
      preset.HouseRooms.forEach((room) => {
        let stringActuators = "";
        room.RoomActuators.forEach((actuator, index) => {
        stringActuators += actuator.name;
        if (index < room.RoomActuators.length - 1) {
          stringActuators += ", ";
        }
        });
        const finalString = `${room.Room.name} (${stringActuators})`;
        rooms.push(finalString);
      });
      return {
        paramName: preset.name,
        rooms,
        type: "preset",
      };
      });
      setHousePresets(updatedPresets);
    }
  }

  useEffect(() => {
    FetchData()
  },[])

  const totalPages = Math.ceil(itemsCount / itemsPerPage);

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
					{housePresets.length > 0 ? (
						housePresets.map((item, index) => (
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
