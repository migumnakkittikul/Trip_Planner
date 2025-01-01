import React from 'react'
import styles from '../Styles/UserPlan.module.css'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useParams, useNavigate } from 'react-router-dom';


export default function UserPlan({planId, planName, description}) {
    const navigate = useNavigate();

    const handlePlanClick = (planId) => {

        console.log('Navigating to plan:', planId);
        navigate(`/plans/${planId}`); // Navigate to the plan details route
      };
  return (
    <div className={styles.UserPlanContainer} onClick={() => handlePlanClick(planId)}>
        <div className={styles.ColValue} style={{width:'15%'}}>
            <h3 style={{fontWeight:400,marginLeft:"10px"}}>{planId}</h3>
        </div>
        <div className={styles.ColValue} style={{width:'35%'}}>
            <h3 style={{fontWeight:400,marginLeft:"10px"}}>{planName}</h3>
        </div>
        <div className={styles.ColValue} style={{width:'40%'}}>
            <h3 style={{fontWeight:400,marginLeft:"10px"}}>{description}</h3>
        </div>
        <div className={styles.ColValue} style={{width:'10%'}}>
            <ArrowForwardIosIcon className={styles.ArrowIcon}/>
        </div>        
    </div>
  )
}
