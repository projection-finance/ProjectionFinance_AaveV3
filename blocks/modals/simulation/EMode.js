import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
const EMode = (props) => {
    const {open, onClose} = props;
    const [tempLastHour, setTempLastHour] = useState('');
    useEffect(() => {
        // Séparer les heures et les minutes en utilisant le caractère ':' comme séparateur
        const [hours, minutes] = lastHour.split(':').map(Number);
      
        // Ajouter une minute aux minutes
        const newMinutes = minutes + 1;
      
        // Calculer les heures et les minutes résultantes en tenant compte de tout dépassement
        const newHours = hours + Math.floor(newMinutes / 60);
        const finalMinutes = newMinutes % 60;
      
        // Formater la chaîne de temps résultante
        const tempTime = `${newHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
      
        // Stocker la chaîne de temps dans tempLastHour
        setTempLastHour(tempTime);
      }, [lastHour]);
      const handleLastHourChange = (e) => {
        setErrorText()
        const newLastHour = e.target.value;
        e.target.blur();
        const currentLastHourDate = new Date(`1970-01-01T${newLastHour}:00`);
        const previousLastHourDate = new Date(`1970-01-01T${lastHour}:00`);
        if (currentLastHourDate < previousLastHourDate) {
          setErrorText(`Time of your new action must be after the time of the last action at ${lastHour}`)
          setDisableBtn(true);
        }
        else {
          setTempLastHour(e.target.value);
          setDisableBtn(false);
        }  
      };
    return (
        <Modal open={open} onClose={onClose}>
            <div className='text-sm text-white'>
                E-mode
            </div>
            <Item className="mt-4">
                <div className="">
                    <div className="flex justify-between gap-4">
                        <div className="text-white text-sm">E-mode</div>
                        <div className="text-gray-light text-sm">Enable &#62; Disable</div>
                    </div>
                    <div className="flex justify-between gap-4 mt-4">
                        <div className="text-white text-sm">Health Factor</div>
                        <div className="text-gray-light text-sm text-end">8.72 &#62; 8.73</div>
                    </div>
                </div>
            </Item>
            <div className="w-full mt-4 flex justify-center gap-3">
                <ButtonOutlined
                    className={'w-[120px] py-2 px-5 text-xs'}
                    label="Cancel"
                    onClick={onClose}/>
                <ButtonFilled label="Disable"/>
            </div>
        </Modal>
    )
};
export default EMode;