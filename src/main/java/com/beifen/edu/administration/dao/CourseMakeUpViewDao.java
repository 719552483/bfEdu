package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.MakeUpGradePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface CourseMakeUpViewDao extends JpaRepository<MakeUpGradePO, Long>, JpaSpecificationExecutor<MakeUpGradePO> {

}

