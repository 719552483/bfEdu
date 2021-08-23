package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu500;
import com.beifen.edu.administration.domian.Edu603;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


@Configuration
public interface Edu603Dao extends JpaRepository<Edu603, Long>, JpaSpecificationExecutor<Edu603> {
    //查看所有审批流
    @Query(value = "select * from edu603 e order by business_type", nativeQuery = true)
    List<Edu603> queryAllApprove();
}
