import React from 'react'
import styles from '../Styles/UserBooking.module.css'

export default function UserBooking({ ordinal, type, id, from, to, closestToAirport }) {
  return (
        <div className={styles.ColumnName}>
            <div className={styles.ColName} style={{width:'10%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{ordinal}</h3>
            </div>
            <div className={styles.ColName} style={{width:'20%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{type}</h3>
            </div>
            <div className={styles.ColName} style={{width:'10%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{id}</h3>
            </div>
            <div className={styles.ColName} style={{width:'20%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{type === "flight" ? from : "N/A"}</h3>
            </div>
            <div className={styles.ColName} style={{width:'20%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{type === "flight" ? to : "N/A"}</h3>
            </div>
            <div className={styles.ColName} style={{width:'20%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{type === "airbnb" ? closestToAirport : "N/A"}</h3>
            </div>        
        </div>
  );
}
