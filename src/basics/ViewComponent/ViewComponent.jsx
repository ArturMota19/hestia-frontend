// Components
// Images

// Imports
import Button from "../../basics/Button/Button";
import { useTranslation } from "react-i18next";
//Styles
import s from "./ViewComponent.module.scss";

export default function ViewComponent({
	index,
	title,
	room=[],
	actuatorSpec=[],
	capacity=null,
	type, 
	image="/",
	hasActions = false,
}) {
	console.log(room)
  const { t } = useTranslation();
  const columns = 2;
	const row = Math.floor(index / columns);
	const col = index % columns;
	const isEvenRow = row % 2 === 0;

	const isColorA = (isEvenRow && col === 0) || (!isEvenRow && col === 1);

	return (
		<div
			key={index}
			className={
				isColorA
					? `${s.wrapperViewComponent} ${s.oddColor}`
					: `${s.wrapperViewComponent} ${s.evenColor}`
			}
		>
			<div className={s.wrapperInfo}>
				<h5>{title}</h5>
				{capacity && <p>{t("capacity")}: {capacity}</p>}
				{room.length > 0 && <p>{t("rooms")}: {room.join(", ")}</p>}
				{actuatorSpec.length > 0 &&
					actuatorSpec.map((spec, index) => {
						const [key, value] = Object.entries(spec)[0];
						return(
							<p key={index}>{key} - {value}</p>
						)
					})
				}
        {hasActions &&
          <div className={s.buttonsDiv}>
            <Button 
            text={t('edit')} 
            backgroundColor={"secondary"} 
            height={36}
            doFunction={() => console.log("edit")}/>
            <Button 
            text={t('delete')} 
            backgroundColor={"delete"} 
            height={36}
            doFunction={() => console.log("delete")}/>
          </div>
        }
			</div>
			<img src={image} alt={type} />
		</div>
	);
}
