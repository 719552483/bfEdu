package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.ScheduleViewPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ScheduleViewDao extends JpaRepository<ScheduleViewPO, Long>, JpaSpecificationExecutor<ScheduleViewPO> {

}

