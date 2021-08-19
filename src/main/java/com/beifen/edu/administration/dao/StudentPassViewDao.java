package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.StudentPassViewPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface StudentPassViewDao extends JpaRepository<StudentPassViewPO, Long>, JpaSpecificationExecutor<StudentPassViewPO> {


}

