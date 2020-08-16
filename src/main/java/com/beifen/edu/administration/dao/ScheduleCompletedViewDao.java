package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.TeachingSchedulePO;
import com.beifen.edu.administration.domian.Edu204;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ScheduleCompletedViewDao extends JpaRepository<TeachingSchedulePO, Long>, JpaSpecificationExecutor<TeachingSchedulePO> {

}

