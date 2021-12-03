package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.StudentWorkViewPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface StudentWorkViewDao extends JpaRepository<StudentWorkViewPO, Long>, JpaSpecificationExecutor<StudentWorkViewPO> {


}

