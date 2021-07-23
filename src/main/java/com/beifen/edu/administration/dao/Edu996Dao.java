package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu996;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Configuration
public interface Edu996Dao extends JpaRepository<Edu996, Long>, JpaSpecificationExecutor<Edu996> {

    //查询所有日志
    @Query(value = "select * from edu996 ORDER BY time desc", nativeQuery = true)
    List<Edu996> selectAllLog();
}
