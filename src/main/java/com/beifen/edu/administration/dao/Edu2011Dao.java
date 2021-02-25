package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu201;
import com.beifen.edu.administration.domian.Edu2011;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Configuration
public interface Edu2011Dao extends JpaRepository<Edu2011, Long>, JpaSpecificationExecutor<Edu2011> {
    //查询再排记录
    @Query(value = "select * from edu2011 e where e.edu202_Id=?1", nativeQuery = true)
    List<Edu2011> reComfirmSchedule(String edu202Id);
}
