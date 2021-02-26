package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu600;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface Edu600Dao extends JpaRepository<Edu600, Long>, JpaSpecificationExecutor<Edu600> {

    //根据关联键查询
    @Query(value = "select * from Edu600 t where t.BUSINESS_KEY =?1",nativeQuery = true)
    Edu600 countoneByBUSINESSKEY(String BUSINESS_KEY);
}
