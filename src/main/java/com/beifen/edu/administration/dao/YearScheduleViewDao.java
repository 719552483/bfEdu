package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.YearSchedulePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface YearScheduleViewDao extends JpaRepository<YearSchedulePO, Long>, JpaSpecificationExecutor<YearSchedulePO> {

}

